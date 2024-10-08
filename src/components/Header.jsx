export default function Header() {
  return (
    <header className='flex items-center justify-between gap-4 p-4'>
      <a href='/'>
        <h1 className='font-medium font-semibold'>
          Echo<span className='text-indigo-600 bold'>Text</span>
        </h1>
      </a>
      <a
        href='/'
        className='flex items-center gap-2 specialBtn text-sm px-3 p-2 rounded-lg text-indigo-600'
      >
        <p>New</p>
        <i className='fa-regular fa-square-plus'></i>
      </a>
    </header>
  );
}
