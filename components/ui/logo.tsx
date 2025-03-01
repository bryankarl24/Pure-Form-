export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center">
        <span className="text-2xl font-bold tracking-wider">PU</span>
        {/* Silhouette of weightlifter with barbell */}
        <div className="relative mx-1 w-8">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            {/* Silhouette design for weightlifter with barbell */}
            <path d="M12 2C11.2 2 10.5 2.5 10.5 3.2V4H9.3C8.5 4 8 4.7 8 5.3V7H7V6.2C7 5.5 6.3 5 5.7 5C5 5 4.5 5.7 4.5 6.3V17.7C4.5 18.4 5.2 19 5.8 19C6.5 19 7 18.3 7 17.7V17H8V18.7C8 19.4 8.7 20 9.3 20H10.5V20.8C10.5 21.5 11.2 22 11.8 22C12.5 22 13 21.3 13 20.7V20H14.2C14.9 20 15.5 19.3 15.5 18.7V17H16V17.7C16 18.4 16.7 19 17.3 19C18 19 18.5 18.3 18.5 17.7V6.3C18.5 5.6 17.8 5 17.2 5C16.5 5 16 5.7 16 6.3V7H15.5V5.3C15.5 4.6 14.8 4 14.2 4H13V3.3C13 2.6 12.3 2 11.7 2H12Z" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-wider">FORM</span>
      </div>
      <span className="text-[0.65rem] font-medium tracking-[0.25em] mt-1">MOVE. NOURISH. THRIVE.</span>
    </div>
  )
}

