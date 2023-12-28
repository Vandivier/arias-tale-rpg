import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";
import { useState, useEffect } from "react";

export default function ArtRollPage() {
  const [artRoll, setArtRoll] = useState(null);

  const fetchArtRoll = async () => {
    try {
      const response = await fetch("/api/art-roll");
      const data = await response.json();
      setArtRoll(data);
    } catch (error) {
      console.error("Error fetching art roll:", error);
    }
  };

  useEffect(() => {
    fetchArtRoll();
  }, []);

  const handleRollClick = () => {
    fetchArtRoll();
  };

  return (
    <CustomPage mainHeading="Gallery">
      <button
        onClick={handleRollClick}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Reroll!
      </button>
      {artRoll && (
        <div>
          <h2>Art Roll Result</h2>
          <ol>
            <li>Pieces Rolled: {artRoll.pieces.length}</li>
            {/* Add more structured data presentation here */}
          </ol>
        </div>
      )}
    </CustomPage>
  );
}
