export const averageFunction = (
  totalContributors: number,
  totalContributions: number
): number => {
  return totalContributions / totalContributors;
};

export const validateUrl = (url: string) => {
  if (
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    )
  ) {
    return true;
  } else {
    return false;
  }
};
