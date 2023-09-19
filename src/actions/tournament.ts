"use server";

export async function createTournament(name: string, epochStart: number) {
  const start = new Date(epochStart);
  console.log({ name, start });
  //TODO: validate arguments
}
