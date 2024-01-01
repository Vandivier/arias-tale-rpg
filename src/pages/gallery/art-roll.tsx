import { api } from "~/utils/api";
import { CustomPage } from "~/components/CustomPage";

export default function ArtRollPage() {
  const { data, isLoading, isError, refetch } = api.art.getArtRoll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error occurred</span>;

  const handleRollClick = async () => {
    await refetch();
  };

  return (
    <CustomPage mainHeading="Gallery">
      <button
        onClick={handleRollClick}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Reroll!
      </button>
      {data && (
        <div>
          <h2 className={`py-2 text-2xl`}>Art Roll Result</h2>

          {data.length ? (
            <>
              <h3>Pieces Rolled: {data.length}</h3>

              <ol>
                {data.map((art, idx) => {
                  const promptText = `Draw ${art.subject}. Use the art style ${art.style}`;

                  return (
                    <li className={`py-6`} key={`${art.subject}-${idx}`}>
                      <p>Piece #{idx + 1}</p>
                      <p>{promptText}</p>
                      <button
                        className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                        onClick={async () => {
                          await navigator.clipboard.writeText(promptText);
                        }}
                      >
                        Copy Prompt to Clipboard
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <h3>No art found</h3>
          )}
        </div>
      )}
    </CustomPage>
  );
}
