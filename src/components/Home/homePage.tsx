import React, { useState } from "react";

const HomePage = () => {

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<
        "initial" | "uploading" | "success" | "fail"
    >("initial");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setStatus("initial");
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        // TODO: Implement the file upload logic here using AWS pre signed URL
        setStatus("uploading");

        try {
            const response = await fetch(`https://5ooesq9dae.execute-api.us-east-1.amazonaws.com/prod/uploadFile?filename=${encodeURIComponent(file.name)}`, {
                method: 'GET',
            });

            const preSignedPostData = await response.json();

            console.log("Post url data is : ", preSignedPostData);
            console.log("preSignedPostData.fields is : ", preSignedPostData.fields);

            if (!response.ok) {
                throw new Error(preSignedPostData.error || 'Failed to get presigned URL');
            }

            const formData = new FormData();
            console.log("After transformation postData is :  ", formData);

            Object.keys(preSignedPostData.fields).forEach(key => {
                formData.append(key, preSignedPostData.fields[key]);
            });
            formData.append('file', file);

            for (const pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            console.log("After transformation postData is : ", formData);

            // Upload the file to S3 using the presigned POST data
            const uploadResponse = await fetch(preSignedPostData.url, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('File upload failed');
            }

            setStatus("success");

        } catch (error) {
            setStatus("fail");
            return;
        }
    };

    const generateLink = async () => {

        

        return;
    };

    return (
        <>
            <div>
                <label htmlFor="file">Choose a file</label>
                <input id="file" type="file" onChange={handleFileChange} />
            </div>
            {
                file && (
                    <section>
                        File details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {file.size} bytes</li>
                        </ul>
                    </section>
                )
            }

            {
                file && (
                    <button onClick={handleUpload}>Upload a file</button>
                )
            }

            <Result status={status} />

            {
                status === "success" && (
                    <section>
                        <p> As of now we are just allowing 5 minutes access to the user</p>
                        <button onClick={generateLink}>Generate a Link</button>
                    </section>
                )
            }

        </>
    )
}

const Result = ({ status }: { status: string }) => {
    if (status === "success") {
        return <p>✅ File uploaded successfully!</p>;
    } else if (status === "fail") {
        return <p>❌ File upload failed!</p>;
    } else if (status === "uploading") {
        return <p>⏳ Uploading selected file...</p>;
    } else {
        return null;
    }
};

export default HomePage;