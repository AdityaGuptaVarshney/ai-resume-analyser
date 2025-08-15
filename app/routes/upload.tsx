import React, {type FormEvent} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2image";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "~/constants";

const Upload = () => {
    const {auth , fs , isLoading , ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isprocessing, setIsprocessing] = React.useState(false);
    const [statusText, setStatusText] = React.useState("");
    const [file, setFile] = React.useState<File | null >(null);

    const handleFileSelect = (file:File | null  ) => {
        setFile(file);
    }
    const handleAnalyze = async ({companyName , jobTitle , jobDescription , file }:{companyName:string , jobTitle:string , jobDescription:string , file : File }) => {
        setIsprocessing(true);
        setStatusText("Uploading file...");
        const uploadedFile = await fs.upload([file]);

        if (!uploadedFile) return setStatusText('Error: Could not upload file.');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to Image');

        setStatusText('Uploading image...');

        const uploadedImage = await fs.upload([imageFile.file])
        if (!uploadedImage) return setStatusText('Error: Failed to upload Image');

        setStatusText('Preparing Data...');

        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analysing ...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        )

        if (!feedback) return setStatusText('Error: Generating feedback...');

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analysis completed ...');
        console.log('Analysis completed');
        console.log(data);

        // Navigate to the resume page and return to prevent further execution
        navigate(`/resume/${uuid}`);
        return;
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description')  as string;

        if(!file) return;
        handleAnalyze({companyName,jobTitle, jobDescription ,file})

    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
            <Navbar/>

            <section className="main-section">

                <div className="page-heading ">
                    <h1>Smart feedback for your dream job </h1>
                    {isprocessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className='w-full' />
                        </>
                    ) : (
                            <h2>Drop your Resume for an ATS Score and improvement tips</h2>
                            )}
                    {!isprocessing ? (
                        <form id="upload-form" onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type='text' name='company-name' placeholder='Company Name' id='company-name'/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type='text' name='job-title' placeholder='Job Title' id='job-title'/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name='job-description' placeholder='Job Description' id='job-description'/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            <button type="submit" className="primary-button">Analyse Resume</button>
                        </form>
                    ) : ( <>
                    </>)}

                </div>
            </section>
        </main>
            )
}
export default Upload
