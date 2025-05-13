import { capitalize } from "@/helpers/capitalizeFirstLetter";
import { FileGCPStorage } from "@/types/FileGCPStorage.type";

type PdfDocumentListProps = {
  files: FileGCPStorage[];
  title?: string;
  showIndex?: boolean;
};

export const PdfDocumentList: React.FC<PdfDocumentListProps> = ({
  files,
  title,
  showIndex = true,
}) => {

  const handleViewPdf = async (fileName: string) => {
    try {
      const res = await fetch(`/api/viewFile?name=${encodeURIComponent(fileName)}`);
      const data = await res.json();
      data ? window.open(data, '_blank') : new Error('No se pudo obtener el archivo.');      
    } catch (err) {
      console.error('Error fetching signed URL', err);
      alert('Hubo un problema con el archivo PDF.');
    }
  };

  return (
    <section className="px-6 py-5 w-screen text-center">
      {title && <h2 className="text-2xl font-semibold text-center mb-6 underline">{title}</h2>}
      <ol className="flex flex-wrap justify-around items-center">
        {files.map((file, index) => (
          <li
            key={file.name}
            className="flex flex-wrap justify-center max-w-96 p-4 pr-15 mb-8 shadow rounded sm:justify-items-start"
          >
            <span className="text-lg font-medium p-3">
              {showIndex ? `${index + 1}. - ` : ''}{capitalize(file.name)}
            </span>
            <button
              onClick={() => handleViewPdf(file.name)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mb-4"
            >
              Ver Documento
            </button>           
          </li>
        ))}
      </ol>
    </section>
  )
}