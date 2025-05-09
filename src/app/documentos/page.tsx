"use client";

import { useEffect, useState } from "react";

import { Loader, PdfDocumentList } from "@/components";
import { FileGCPStorage } from "@/types/FileGCPStorage";

const isNumericDate = (value: string | undefined): boolean => {
    return /^\d{8}$/.test(value || '');
};

const parseDate = (ddMMyyyy: string): Date => {
    const day = ddMMyyyy.slice(0, 2);
    const month = ddMMyyyy.slice(2, 4);
    const year = ddMMyyyy.slice(4, 8);
    return new Date(`${year}-${month}-${day}`);
};

export default function Minutas() {
    const [showLoader, setShowLoader] = useState(true);
    const [meeting, setMeeting] = useState<FileGCPStorage[]>([]);
    const [documents, setDocuments] = useState<FileGCPStorage[]>([]);

    const assignFileType = (files: FileGCPStorage[]) => {
        const meeting: FileGCPStorage[] = [];
        const documents: FileGCPStorage[] = [];

        files.forEach((file) => {
            const rawDate = file.metadata?.date;
            isNumericDate(rawDate) ?
                meeting.push(file) :
                documents.push(file);
        });

        meeting.sort((a, b) => {
            const dateA = parseDate(a.metadata.date);
            const dateB = parseDate(b.metadata.date);
            return dateB.getTime() - dateA.getTime(); // Descendente
        });

        setMeeting(meeting);
        setDocuments(documents);
        setShowLoader(false);
    }

    useEffect(() => {
        fetch('/api/viewFile')
            .then(res => res.json())
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
                        <PdfDocumentList files={meeting} title="Minutas y Convocatorias de asamblea." />
                        <PdfDocumentList files={documents} title="Documentación" />
                    </>
            }
        </div>
    );
}