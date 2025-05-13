import { Storage } from '@google-cloud/storage';

const formattedPrivateKey = process.env.PRIVATE_KEY_GCP?.replace(/\\n/g, '\n');

export const storage = new Storage({
    projectId: process.env.PROJECT_ID_GCP,
    credentials: {
        type: 'service_account',
        project_id: process.env.PROJECT_ID_GCP,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: formattedPrivateKey,
        client_email: process.env.CLIENT_EMAIL_GCP,
        client_id: process.env.CLIENT_ID_GCP,
    }
});

export const bucketName = process.env.BUCKET_NAME_GCP;

export const getListFiles = async () => {
    if (bucketName === undefined) {
        return { error: 'BUCKET_NAME_GCP is not defined' };
    }
    try {
        const [files] = await storage.bucket(bucketName).getFiles();
        const fileUrls = await Promise.all(
            files.map(async (file) => {               
                const [metadata] = await file.getMetadata();
                return {
                    name: file.name,                    
                    metadata: metadata.metadata
                };
            })
        );
        return fileUrls;
    } catch (err) {
        console.error(err);
        return { error: 'Error al obtener los archivos.' };
    }
}

export const getFile = async (fileName: string) => {
    if (bucketName === undefined) {
        return { error: 'BUCKET_NAME_GCP is not defined' };
    }
    try {
        const file = storage.bucket(bucketName).file(fileName);
        const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires:  Date.now() + 15 * 60 * 1000, // 100 => 1.5 minutos
        });
        return url;
    } catch (err) {
        console.error(err);
        return { error: 'Error al obtener el archivo.' };
    }
}
