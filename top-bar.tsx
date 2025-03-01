export function TopBar() {
  return (
    <div className="fixed top-0 right-0 h-14 bg-black border-b border-gray-800 z-50 transition-all duration-300 left-[72px]">
      <div className="w-full h-full px-4 flex items-center justify-between">
        <h1
          className="text-white text-2xl font-serif tracking-tight md:hidden"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          PureForm
        </h1>
      </div>
    </div>
  )
}

