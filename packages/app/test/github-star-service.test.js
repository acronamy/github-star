const GithubStarService = require('../services/github-star-service');
const { datePad } = require('../utils/time-utils');

describe("Getting data", () => {
  test("should fetch data from github or cache with only 3 entries", async () => {
    // Arrange
    const service = new GithubStarService();
    // Act
    const { items } = await service.requestStarData();
    // Assert
    expect(items.length).toBe(3);
  });
  test("should fetch data from github or cache with only 10 entries", async () => {
    // Arrange
    const service = new GithubStarService();
    const language = "Python";
    const resultsNumber = 10;
    // Act
    const { items } = await service.requestStarData({
      language,
      resultsNumber
    });
    // Assert
    expect(items.length).toBe(resultsNumber);
  });
  test("should not cache data with a custom resultNumber to prevent attacks", async () => {
    // Arrange
    const service = new GithubStarService("Aug 2, 2018");
    const language = "TypeScript";
    const resultsNumber = 30;
    // Act
    const { items } = await service.requestStarData({
      language,
      resultsNumber
    });
    // Assert
    const cached = await service._hasCache(`${language}--2018-01-02--2018-02-02.json`);
    expect(cached).toBe(false);
    expect(items.length).toBe(resultsNumber);
  });
  test("should limit results with a custom resultNumber to 30 entries to prevent attacks", async () => {
    // Arrange
    const service = new GithubStarService("Aug 2, 2018");
    const language = "TypeScript";
    const resultsNumber = 9e9; // alot
    // Act
    const { items } = await service.requestStarData({
      language,
      resultsNumber
    });
    // Assert
    const cached = await service._hasCache(`${language}--2018-01-02--2018-02-02.json`);
    expect(cached).toBe(false);
    expect(items.length).toBe(30);
  });
  test("should fetch data from github about repos created from a relative month based on todays date", async () => {
    // Arrange
    const service = new GithubStarService(); // random fixed date
    const { items } = await service.requestStarData();
    // a list of dates [DD-MM-YY](3)
    const daysMonthsYears = items.map(item => item.created_at.split("T")[0]);
    const TODAY_MONTH = new Date().getMonth() + 1; // 0 indexed
    // Act
    // Are the months within this month and last month
    const monthsInRange = daysMonthsYears.every(date => date.includes(`-${datePad(TODAY_MONTH - 1)}-`) || date.includes(`-${datePad(TODAY_MONTH)}-`));
    // Assert
    expect(monthsInRange).toBe(true);
  });
  test("should fetch data from github about repos with the primary language JavaScript", async () => {
    // Arrange
    const service = new GithubStarService();
    // Act
    const { items } = await service.requestStarData();
    // Assert
    expect(
      items
        .map(chunk => chunk.language === "JavaScript")
        .every(value => value)
    ).toBe(true);
  });
  test("should fetch data from github about repos with the primary language Python", async () => {
    // Arrange
    const service = new GithubStarService();
    const language = "Python";
    const resultsNumber = 3;
    // Act
    const { items } = await service.requestStarData({ 
      language,
      resultsNumber
    });
    // Assert
    expect(
      items
        .map(chunk => chunk.language === language)
        .every(value => value)
    ).toBe(true);
  });
  describe("dates from last mounth", () => {
    test("should return the number for the previous month relative to this month", () => {
      // Arrange
      const service = new GithubStarService('December 25, 1999');
      // Act
      const { day, month, year } = service._getLastMonth().next().value;
      // Assert
      expect(month).toBe(11);
      expect(year).toBe(1999);
      expect(day).toBe(25);
    });
    test("should return the number for the previous month relative to this month and the previous year if Jan", () => {
      // Arrange
      const service = new GithubStarService('January 14, 1999');
      // Act
      const { day, month, year } = service._getLastMonth().next().value;
      // Assert
      expect(month).toBe(12);
      expect(year).toBe(1998);
      expect(day).toBe(14);
    });
    /**
     * @see packages/app/utils/time-utils.js
     * tests this functionality in full but this test is double checking the wrapper works
    */
    test("If today is the 31st of Mar, the day returned should be the 29th of Feb - depending on leap years", () => {
      // Arrange
      const service = new GithubStarService('March 31, 2018');
      // Act
      const { day, month, year } = service._getLastMonth().next().value;
      // Assert
      expect(month).toBe(2); // Feb at 1 index
      expect(year).toBe(2018);
      expect(day).toBe(28);
    });
    test("If today is the 12th of Mar, the day returned should be the 12th of Feb - depending on leap years", () => {
      // Arrange
      const service = new GithubStarService('March 12, 2018');
      // Act
      const { day, month, year } = service._getLastMonth().next().value;
      // Assert
      expect(month).toBe(2); // Feb at 1 index
      expect(year).toBe(2018);
      expect(day).toBe(12);
    });
  });
});