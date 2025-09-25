export default function Logos() {
  const logosURL = ["logo_1.svg", "logo_2.jpg", "logo_3.jpg"]
  return (
    <footer className="flex gap-x-2 bg-white rounded-3xl shadow-xl shadow-green-100 p-8 border border-green-100">
      {logosURL.map((v, i) => (
        <img
          key={i}
          src={`/${v}`}
          alt="A descriptive text for the image"
          width="200"
          height="150"
        />
      ))}
    </footer>
  )
}
