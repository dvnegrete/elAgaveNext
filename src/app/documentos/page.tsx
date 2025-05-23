"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader, PdfDocumentList } from "@/components";
import { FileGCPStorage } from "@/shared/types/FileGCPStorage.type";

const isNumericDate = (value: string | undefined): boolean => {
    return /^\d{8}$/.test(value || '');
};

const parseDate = (ddMMyyyy: string): Date => {
    const day = ddMMyyyy.slice(0, 2);
    const month = ddMMyyyy.slice(2, 4);
    const year = ddMMyyyy.slice(4, 8);
    return new Date(`${year}-${month}-${day}`);
};

export default function Documents() {
    const [showLoader, setShowLoader] = useState(true);
    const [documents, setDocuments] = useState<FileGCPStorage[]>([]);
    const router = useRouter();

    const assignFileType = (files: FileGCPStorage[]) => {
        const meeting: FileGCPStorage[] = [];
        const documents: FileGCPStorage[] = [];

        files.forEach((file) => {
            const rawDate = file.metadata?.date;
            !isNumericDate(rawDate) && documents.push(file);
        });

        meeting.sort((a, b) => {
            const dateA = parseDate(a.metadata.date);
            const dateB = parseDate(b.metadata.date);
            return dateB.getTime() - dateA.getTime(); // Descendente
        });

        setDocuments(documents);
        setShowLoader(false);
    }

    useEffect(() => {
        fetch('/api/viewFile')
            .then(async res => {
                if (res.status === 401) {
                    router.push('/login');
                    return [{name: '', metadata: { date: '' }}];
                }
                return res.json();
            })
            .then(data => assignFileType(data));
    }, []);

    return (
        <div className="w-screen text-center">
            {
                showLoader
                    ?
                    <Loader />
                    :
                    <>
                        <PdfDocumentList files={documents} title="Documentos" />
                    </>
            }
        </div>
    );
}