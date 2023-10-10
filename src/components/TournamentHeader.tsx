type TournamentHeaderProps = {
  name: string;
  start: Date;
  totalTeams: number;
};
export default function TournamentHeader({
  name,
  start,
  totalTeams,
}: TournamentHeaderProps) {
  return (
    <div className="flex items-center py-2 md:py-4">
      <h1 className="text-xl md:text-3xl capitalize font-semibold py-3 md:py-6 mr-6 md:mr-16">
        {name}
      </h1>
      <span className="block mr-auto">{`${totalTeams} team${
        totalTeams !== 1 ? "s" : ""
      }`}</span>
      <div>
        <p>
          <span className="hidden sm:inline">on </span>
          <span>{start.toLocaleDateString()}</span>
        </p>
        <p>
          <span className="hidden sm:inline">starts at </span>
          <span>{start.toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
}
