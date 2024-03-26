import { redirect } from "@/src/lib/intl/navigation"


export default  async function page() {
    redirect('/login?error=true')
}
