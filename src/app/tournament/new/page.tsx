export default function NewTournament() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentName">Name</label>
          <input
            type="text"
            name="tournamentName"
            id="tournamentName"
            className="text-black"
          />
        </div>
        <div>
          <button className="m-4 bg-orange-500 rounded-lg py-2 px-4">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
