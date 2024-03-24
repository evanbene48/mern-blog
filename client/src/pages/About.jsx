export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Evan' Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Evan's Blog! This blog was created by following tutorial from Sahand Ghavidel
              Youtube to improve my MERN stack skill. I was targeting to create 5 MERN stacks in 2024.
            </p>

            <p>
              This blog will be the first and the start of my journey in exploring and developing MERN Stack.
            </p>

            <p>
              I encourage you to the test the functionality of this website and
              if there is any bugs or suggestion, please let me know by contacting me 
              on :
            </p>
            <p className="">
              Discord : yuezhong312              
            </p>
            <p>
              Gmail : evanbene48@gmail.com
            </p>
            <p>
              Cheers !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}