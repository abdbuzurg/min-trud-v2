export default function Logos() {
  const logosURL = ["logo_1.svg", "logo_2.jpg", "logo_3.jpg"]
  return (
    <footer className="grid w-full grid-cols-1 gap-3 rounded-3xl border border-green-100 bg-white p-4 shadow-xl shadow-green-100 sm:grid-cols-3 sm:gap-4 sm:p-6">
      {logosURL.map((v, i) => (
        <img
          key={i}
          src={`/${v}`}
          alt="A descriptive text for the image"
          className="h-20 w-full object-contain sm:h-24"
        />
      ))}
    </footer>
  )
}
