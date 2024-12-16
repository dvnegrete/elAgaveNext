"use server"

type Register = {
    whats: number;
    email: string;
}

export const readData = async (formData: Register) => {
    const whats = formData.whats;
    const email = formData.email;
    debugger;
    console.log(formData);
    console.log("---------");    
    console.log(whats, email);
    // const {data} = useWriteEmails({username, email})
}