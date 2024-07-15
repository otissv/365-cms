import { guard } from "./guard"

describe("guard", () => {
  it("it should return correct match", () => {
    const isTeacher = (name: string) => name === "Teacher"
    const isDirector = (name: string) => name === "Director"
    const isRicky = (name: string) => name === "Ricky"

    const actual = guard(
      [isTeacher, "Hey Professor!"],
      [isDirector, "Hello Director."],
      [isRicky, (name: number) => `Still here ${name}? `],
      "Hello"
    )

    expect(actual("Teacher")).toEqual("Hey Professor!")
    expect(actual("Director")).toEqual("Hello Director.")
    expect(actual("Ricky")).toEqual("Still here Ricky? ")
    expect(actual("John")).toEqual("Hello")
  })
})
