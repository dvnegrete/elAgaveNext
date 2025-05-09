import { capitalize } from "@/helpers/capitalizeFirstLetter";
import { FileGCPStorage } from "@/types/FileGCPStorage";

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
  return (
    <section className="px-6 py-4 w-screen text-center">
      {title && <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>}
      <div className="flex flex-wrap justify-center items-center">
        {files.map((file, index) => (
          <div
            key={file.name}
            className="w-full max-w-3xl p-4 mb-8 shadow rounded"
          >
            <h3 className="text-lg font-medium mb-2">
              {showIndex ? `${index + 1}. - ` : ''}{capitalize(file.name)}
            </h3>
            <button
              onClick={() => window.open(file.url, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mb-4"
            >
              Ver PDF en nueva pestaña
            </button>
            <iframe
              src={file.url}
              className="w-full h-[500px] border border-gray-300 rounded"
              title={file.name}
            />
          </div>
        ))}
      </div>
    </section>
  )
}