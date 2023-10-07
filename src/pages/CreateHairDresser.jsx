import { redirect } from "react-router-dom";
import CreateHairDresserForm from "../components/CreateHairDresserForm";
import { getUserByUsername } from "../utils/http";
import { getAuthToken } from "../utils/auth";

const CreateHairDresserPage = () =>{
    return <CreateHairDresserForm />
}

export default CreateHairDresserPage;

export const loader = async () => {
    const userName = getAuthToken();

    if(!userName || userName === 'Expired') {
        return redirect('/login');
    }

    const user = await getUserByUsername(userName);

    if(!user || user.userType !== 'admin') {
        return redirect('/login');
    }

    return true;

} 