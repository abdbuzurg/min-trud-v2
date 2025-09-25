import JobSeekerEditForm from "./components/JobSeekerEdit";

export default async function JobSeekerPersonal(
  { params }: { params: Promise<{ phoneNumber: string }> }
) {

  const { phoneNumber } = await params

  return (
    <JobSeekerEditForm phoneNumber={phoneNumber} />
  )
}
