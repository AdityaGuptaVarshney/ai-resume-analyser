import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumite" },
    { name: "description", content: "smart feedback for your dream job" },
  ];
}

export default function Home() {


  const { isLoading , auth , fs , kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/')
  },[auth.isAuthenticated ]);



  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar/>

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback</h2>

        ) : (
            <h2>Review your Submissions and check AI-powered feedback.</h2>
        )}
        {loadingResumes && (
            <div className='flex flex-col items-center justify-center'>
              <img src='/images/resume-scan-2.gif' className='w-[200px]'/>
            </div>
        )}
      </div>
      { !loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume}/>
            ))}
          </div>
      )}

      {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to='/upload' className='primary-button w-fit font-semibold text-xl'>
              Upload Resume
            </Link>
          </div>
          )}
        </section>


  </main>
}
