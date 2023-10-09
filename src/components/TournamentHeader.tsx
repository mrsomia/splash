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
    <div className="flex items-center py-4">
      <h1 className="text-3xl capitalize font-semibold py-6 mr-20">{name}</h1>
      <span className="block mr-auto mb-4 self-end">{`${totalTeams} team${
        totalTeams !== 1 ? "s" : ""
      }`}</span>
      <div>
        <p>{`on ${start.toLocaleDateString()}`}</p>
        <p>{`starts at ${start.toLocaleTimeString()}`}</p>
      </div>
    </div>
  );
}
