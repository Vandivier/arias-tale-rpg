import { api } from "~/utils/api";
import { CustomPage } from "~/components/CustomPage";
import { Button } from "~/components/ui/button";

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
      <Button onClick={handleRollClick} size={"lg"} variant="secondary">
        Reroll!
      </Button>
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
                      <Button
                        className="mt-2"
                        onClick={async () => {
                          await navigator.clipboard.writeText(promptText);
                        }}
                        size={"lg"}
                        variant="secondary"
                      >
                        Copy Prompt to Clipboard
                      </Button>
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
