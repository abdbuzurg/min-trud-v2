import JobSeekerEditForm from "./components/JobSeekerEdit";

export default async function JobSeekerPersonal(
  { params }: { params: { phoneNumber: string } }
) {

  const { phoneNumber } = await params

  return (
    <body>
      <JobSeekerEditForm phoneNumber={phoneNumber} />
    </body>
  )
}
