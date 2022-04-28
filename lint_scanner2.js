/**
 * Controller file to handle all the business logics
 */
const { Logger, graphsUtility } = require('../helpers/index');
const { pullrequestModel, issuesModel, commitsModel, commentsModel, forksModel, usersModel } = require('../models/index');
const { graphs } = require('../api/index');
const path = require('path');

/**
 * Handle Commits list
 *
 * @function GetCommitList
 * @param {object} opts
 * @returns {array} - returns commits list
 * @author dev-team
 */
    const GetCommitList = async opts => {
  try {
    const commits = await commitsModel.GetCommitsFromDB(opts);
    return commits ? commits.list.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until) : [];
  } catch (exc) {
    Logger.log('error', `Error in GetCommitList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle PR list
 *
 * @function GetPullRequestList
 * @param {object} opts
 * @returns {array} - returns PR list
 * @author dev-team
 */
const GetPullRequestList = async opts => {
  try {
    const pr = await pullrequestModel.GetPullsFromDB(opts);
    return pr ? pr.list : [];
  } catch (exc) {
    Logger.log('error', `Error in GetPullRequestList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Issue list
 *
 * @function GetIssueList
 * @param {object} opts
 * @returns {array} - returns Issue list
 * @author dev-team
 */
const GetIssueList = async opts => {
  try {
    const issues = await issuesModel.GetIssuesFromDB(opts);
    return issues ? issues.list : [];
  } catch (exc) {
    Logger.log('error', `Error in GetIssueList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Forks list
 *
 * @function GetForkList
 * @param {object} opts
 * @returns {array} - returns Forks list
 * @author dev-team
 */
const GetForkList = async opts => {
  try {
    const forks = await forksModel.GetForksFromDB(opts);
    return forks ? forks.list.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until) : [];
  } catch (exc) {
    Logger.log('error', `Error in GetForkList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Handle Comment list
 *
 * @function GetCommentList
 * @param {object} opts
 * @returns {array} - returns Comments list
 * @author dev-team
 */
const GetCommentList = async opts => {
  try {
    const comments = await commentsModel.GetCommentsFromDB(opts);
    return comments ? comments.list.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until) : [];
  } catch (exc) {
    Logger.log('error', `Error in GetCommentList in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get average time taken to create PR
 *
 * @function GetAverageTimeTakenToCreatePR
 * @param {object} opts
 * @returns {object} - returns data for average time to create PR
 * @author dev-team
 */
const GetAverageTimeTakenToCreatePR = async opts => {
  try {
    let type = '';
    const prList = await GetPullRequestList(opts);
    const prData =
      opts.user !== undefined
        ? prList.filter(el => el.created_at !== null && el.created_at >= opts.since && el.created_at <= opts.until && el.author === opts.user)
        : prList.filter(el => el.created_at !== null && el.created_at >= opts.since && el.created_at <= opts.until);
    let reportsData = [];
    if (prData.length > 0) {
      if (opts.customFlag.toUpperCase() === 'FALSE') {
        reportsData = await graphsUtility.GraphDataSplitUpByDuration(prData, opts, 'getavgtimetocreate');
      } else {
        const days = (Date.parse(opts.until) - Date.parse(opts.since)) / 86400000;
        type = await graphsUtility.GetCustomDuration(days);
        reportsData = await graphsUtility.DataFormationForCustomDuration(prData, opts, type, 'getavgtimetocreate');
      }
    }
    return {
      type,
      reports: reportsData
    };
  } catch (exc) {
    Logger.log('error', `Error in GetAverageTimeTakenToCreatePR in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get average time taken to review PR
 *
 * @function GetAverageTimeTakenToReviewPR
 * @param {object} opts
 * @returns {object} - returns data for average time to review PR
 * @author dev-team
 */
const GetAverageTimeTakenToReviewPR = async opts => {
  try {
    let type = '';
    const prList = await GetPullRequestList(opts);
    const prData = prList.filter(el => el.created_at !== null && el.created_at >= opts.since && el.created_at <= opts.until);
    let reportsData = [];
    if (prData.length > 0) {
      if (opts.customFlag.toUpperCase() === 'FALSE') {
        reportsData = await graphsUtility.GraphDataSplitUpByDuration(prData, opts, 'getavgtimetoreview');
      } else {
        const days = (Date.parse(opts.until) - Date.parse(opts.since)) / 86400000;
        type = await graphsUtility.GetCustomDuration(days);
        reportsData = await graphsUtility.DataFormationForCustomDuration(prData, opts, type, 'getavgtimetoreview');
      }
    }

    return {
      type,
      reports: reportsData
    };
  } catch (exc) {
    Logger.log('error', `Error in GetAverageTimeTakenToReviewPR in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get average time taken to close PR
 *
 * @function GetAverageTimeTakenToReviewPR
 * @param {object} opts
 * @returns {object} - returns data for average time to close PR
 * @author dev-team
 */
const GetAverageTimeTakenToClosePR = async opts => {
  try {
    let type = '';
    const prList = await GetPullRequestList(opts);
    const prData =
      opts.user !== undefined
        ? prList.filter(el => el.closed_at !== null && el.closed_at >= opts.since && el.closed_at <= opts.until && el.author === opts.user)
        : prList.filter(el => el.closed_at !== null && el.closed_at >= opts.since && el.closed_at <= opts.until);
    let reportsData = [];
    if (prData.length > 0) {
      if (opts.customFlag.toUpperCase() === 'FALSE') {
        reportsData = await graphsUtility.GraphDataSplitUpByDuration(prData, opts, 'getavgtimetoclose');
      } else {
        const days = (Date.parse(opts.until) - Date.parse(opts.since)) / 86400000;
        type = await graphsUtility.GetCustomDuration(days);
        reportsData = await graphsUtility.DataFormationForCustomDuration(prData, opts, type, 'getavgtimetoclose');
      }
    }

    return {
      type,
      reports: reportsData
    };
  } catch (exc) {
    Logger.log('error', `Error in GetAverageTimeTakenToClosePR in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get average time taken to close Issue
 *
 * @function GetAverageTimeTakenToCloseIssue
 * @param {object} opts
 * @returns {object} - returns data for average time to close Issue
 * @author dev-team
 */
const GetAverageTimeTakenToCloseIssue = async opts => {
  try {
    let type = '';
    const issuesList = await GetIssueList(opts);
    const issuesData =
      opts.user !== undefined
        ? issuesList.filter(el => el.closed_at !== null && el.closed_at >= opts.since && el.closed_at <= opts.until && el.author === opts.user)
        : issuesList.filter(el => el.closed_at !== null && el.closed_at >= opts.since && el.closed_at <= opts.until);
    let reportsData = [];
    if (issuesData.length > 0) {
      if (opts.customFlag.toUpperCase() === 'FALSE') {
        reportsData = await graphsUtility.GraphDataSplitUpByDuration(issuesData, opts, 'getavgtimetoclose');
      } else {
        const days = (Date.parse(opts.until) - Date.parse(opts.since)) / 86400000;
        type = await graphsUtility.GetCustomDuration(days);
        reportsData = await graphsUtility.DataFormationForCustomDuration(issuesData, opts, type, 'getavgtimetoclose');
      }
    }

    return {
      type,
      reports: reportsData
    };
  } catch (exc) {
    Logger.log('error', `Error in GetAverageTimeTakenToCloseIssue in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get Report Details
 *
 * @function GetReportDetails
 * @param {array} users
 * @param {object} opts
 * @param {object} data
 * @returns {array} - returns report data
 * @author dev-team
 */
const GetReportDetails = async (users, opts, ...data) => {
  try {
    const res = [];
    const [commitsList, prList, issuesList, forksList, commentsList] = data;
    users.forEach(async user => {
      const commitsListFiltered = commitsList.filter(commit => commit.author === user);
      const commits = commitsListFiltered.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until);
      const forksListFilterted = forksList.filter(fork => fork.author === user);
      const forks = forksListFilterted.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until);
      const commentsListFilterted = commentsList.filter(
        comment => comment.author === user && comment.date !== null && comment.date >= opts.since && comment.date <= opts.until
      );
      const prListFiltered = prList.filter(pr => pr.author === user);
      const pulls = prListFiltered.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until);
      const issuesListFiltered = issuesList.filter(issues => issues.author === user);
      const issues = issuesListFiltered.filter(el => el.date !== null && el.date >= opts.since && el.date <= opts.until);
      const [avgTimeToCreatePR, avgTimeToReviewPR, avgTimeToClosePR, avgTimeToCloseIssue] = await Promise.all([
        graphsUtility.GetAverageTimeTakenToCreate(prListFiltered, opts.since, opts.until),
        graphsUtility.GetAverageTimeTakenToReview(prList, opts.since, opts.until, user),
        graphsUtility.GetAverageTimeTakenToClose(prListFiltered, opts.since, opts.until),
        graphsUtility.GetAverageTimeTakenToClose(issuesListFiltered, opts.since, opts.until)
      ]);
      const teamRep = Object.assign({
        name: user,
        createPR: avgTimeToCreatePR,
        reviewPR: avgTimeToReviewPR,
        closePR: avgTimeToClosePR,
        closeIssue: avgTimeToCloseIssue,
        noOfForks: forks.length,
        noOfComments: commentsListFilterted.length,
        noOfCommits: commits.length,
        noOfPulls: pulls.length,
        noOfIssues: issues.length,
        totalContributions: commits.length + pulls.length + issues.length
      });
      res.push(teamRep);
    });
    return res;
  } catch (exc) {
    Logger.log('error', `Error in GetReportDetails in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get Team Report
 *
 * @function GetTeamReport
 * @param {object} opts
 * @returns {array} - returns team report data
 * @author dev-team
 */
const GetTeamReport = async opts => {
  try {
    let result = [];
    const users = [];
    const [commitsList, prList, issuesList, forksList, commentsList] = await Promise.all([
      GetCommitList(opts),
      GetPullRequestList(opts),
      GetIssueList(opts),
      GetForkList(opts),
      GetCommentList(opts)
    ]);

    prList.forEach(pr => {
      users.push(pr.author);
      pr.reviewers.forEach(reviewer => users.push(reviewer.name));
    });
    issuesList.forEach(issue => users.push(issue.author));
    const uniqUsers = users.filter((val, index) => users.indexOf(val) === index).sort();

    if (commitsList.length > 0 || prList.length > 0 || issuesList.length > 0) {
      result = await GetReportDetails(uniqUsers, opts, commitsList, prList, issuesList, forksList, commentsList);
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GetTeamReport in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Get Developer's Profile
 *
 * @function GetDeveloperProfile
 * @param {object} opts
 * @returns {array} - returns developer's profile data
 * @author dev-team
 */
const GetDeveloperProfile = async opts => {
  try {
    const dbData = await usersModel.GetUser({ username: opts.user });
    const oauthFlag = dbData ? dbData.oauth : true;
    let res = {
      name: opts.user
    };
    if (oauthFlag) {
      const profData = await graphs.GetUserDetails(opts.user);
      res = {
        ...res,
        bio: profData.bio,
        email: profData.email,
        avatar_url: profData.avatar_url,
        company: profData.company,
        location: profData.location,
        subscriptionDate: profData.created_at
      };
    }
    if (dbData) res = { ...res, email: dbData.email, image_value: dbData.image_value, avatar_url: dbData.avatar_url };
    return res;
  } catch (exc) {
    Logger.log('error', `Error in GetDeveloperProfile in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

module.exports = {
  GetAverageTimeTakenToCreatePR,
  GetAverageTimeTakenToReviewPR,
  GetAverageTimeTakenToClosePR,
  GetAverageTimeTakenToCloseIssue,
  GetTeamReport,
  GetDeveloperProfile
};
