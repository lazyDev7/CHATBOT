import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import { useRef } from 'react';



const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
    try {
        // Perform the request to the upload authentication endpoint.
        const response = await fetch('http://localhost:3000/api/upload');
        if (!response.ok) {
            // If the server response is not successful, extract the error text for debugging.
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        // Parse and destructure the response JSON for upload credentials.
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Log the original error for debugging before rethrowing a new error.
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};
const Upload = ({ setImg }) => {

    const ikUploadRef = useRef(null)

    const onError = err => {
        console.log("Error,err");
    };

    const onSuccess = res => {
        console.log("Success,res");
        setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
    };

    const onUploadProgress = progress => {
        console.log("Progress,progress");
    };

    const onUploadStart = evt => {
        const file = evt.target.files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            setImg((prev) => ({
                ...prev,
                isLoading: true,
                aiData: {
                    inlineData: {
                        data: reader.result.split(",")[1],
                        mimeType: file.type,
                    },
                },
            }));
        };
        reader.readAsDataURL(file);
    };


    return (
        <IKContext
            urlEndpoint={urlEndpoint}
            publicKey={publicKey}
            authenticator={authenticator}
        >
            <IKUpload
                fileName="test-upload.png"
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                style={{ display: "none" }}
                ref={ikUploadRef}
            />
            {<label onClick={() => ikUploadRef.current.click()}><img src="/attachment.png" alt="" /></label>}
        </IKContext>
    )
}

export default Upload