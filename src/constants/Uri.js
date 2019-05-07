const baseUrl = 'http://you.nefuer.net';

export default {
  schoolList: {
    uri: baseUrl + '/api/v1/schools',
    method: 'GET',
  },
  schoolNeeds: {
    uri: baseUrl + '/api/v1/schools/{id}',
    method: 'GET',
  },
  userAuth: {
    uri: baseUrl + '/api/v1/userAuth',
    method: 'POST',
  },
  userInfo: {
    uri: baseUrl + '/api/v1/users',
    method: 'GET',
  },
  userInfoChange: {
    uri: baseUrl + '/api/v1/users',
    method: 'PUT',
  },
  userInfoOthers: {
    uri: baseUrl + '/api/v1/users/{id}',
    method: 'GET',
  },
  userFollowList: {
    uri: baseUrl + '/api/v1/userFollows/',
    method: 'GET',
  },
  userFollow: {
    uri: baseUrl + '/api/v1/userFollows/{id}',
    method: 'POST',
  },
  userUnfollow: {
    uri: baseUrl + '/api/v1/userFollows/{id}',
    method: 'DELETE',
  },
  userFollowNumber: {
    uri: baseUrl + '/api/v1/userFollowNumbers',
    method: 'GET',
  },
  userFollowNumberOthers: {
    uri: baseUrl + '/api/v1/userFollowNumbers/{id}',
    method: 'GET',
  },
  columnList: {
    uri: baseUrl + '/api/v1/columns/',
    method: 'GET',
  },
  columnInfo: {
    uri: baseUrl + '/api/v1/columns/{id}',
    method: 'GET',
  },
  columnApply: {
    uri: baseUrl + '/api/v1/columns/',
    method: 'POST',
  },
  columnInfoUpdate: {
    uri: baseUrl + '/api/v1/columns/{id}',
    method: 'PUT',
  },
  columnFollowList: {
    uri: baseUrl + '/api/v1/columnFollows',
    method: 'GET',
  },
  columnFollow: {
    uri: baseUrl + '/api/v1/columnFollows/{id}',
    method: 'POST',
  },
  columnUnollow: {
    uri: baseUrl + '/api/v1/columnFollows/{id}',
    method: 'DELETE',
  },
  columnFollowNumber: {
    uri: baseUrl + '/api/v1/columnFollowNumbers ',
    method: 'GET',
  },
  columnFollowNumberOthers: {
    uri: baseUrl + '/api/v1/columnFollowNumbers/{id}',
    method: 'GET',
  },
  pageList: {
    uri: baseUrl + '/api/v1/pages/',
    method: 'GET',
  },
  pagePublish: {
    uri: baseUrl + '/api/v1/pages/',
    method: 'POST',
  },
  pageDelete: {
    uri: baseUrl + '/api/v1/pages/{id}',
    method: 'DELETE',
  },
  pageLikeNumber: {
    uri: baseUrl + '/api/v1/pages/{pid}/likes/',
    method: 'GET',
  },
  pageLike: {
    uri: baseUrl + '/api/v1/pages/{pid}/likes/',
    method: 'POST',
  },
  pageUnlike: {
    uri: baseUrl + '/api/v1/pages/{pid}/likes/',
    method: 'DELETE',
  },
  pageCommentList: {
    uri: baseUrl + '/api/v1/pages/{pid}/comments/',
    method: 'GET',
  },
  pageComment: {
    uri: baseUrl + '/api/v1/pages/{pid}/comments/',
    method: 'POST',
  },
  pageCommentDelete: {
    uri: baseUrl + '/api/v1/pages/{pid}/comments/{cid}',
    method: 'DELETE',
  },
  pageCommentLikeNumber: {
    uri: baseUrl + '/api/v1/comments/{cid}/likes/',
    method: 'GET',
  },
  pageCommentLike: {
    uri: baseUrl + '/api/v1/comments/{cid}/likes/',
    method: 'POST',
  },
  pageCommentUnlike: {
    uri: baseUrl + '/api/v1/comments/{cid}/likes/',
    method: 'DELETE',
  },
  pageCollectList: {
    uri: baseUrl + '/api/v1/collectsPage/',
    method: 'GET',
  },
  pageCollect: {
    uri: baseUrl + '/api/v1/pages/{pid}/collect/',
    method: 'POST',
  },
  pageUncollect: {
    uri: baseUrl + '/api/v1/pages/{pid}/collect/',
    method: 'DELETE',
  },
  messageList: {
    uri: baseUrl + '/api/v1/messages/',
    method: 'GET',
  },
  messageSend: {
    uri: baseUrl + '/api/v1/messages/',
    method: 'POST',
  },
  menu: {
    uri: baseUrl + 'api/v1/menus/',
    method: 'GET',
  },
  menuUpdate: {
    uri: baseUrl + '/api/v1/menus/',
    method: 'PUT',
  },
  score: {
    uri: baseUrl + '/api/v1/scores/',
    methods: 'GET',
  },
  lesson: {
    uri: baseUrl + '/api/v1/lessons/',
    methods: 'GET',
  },
  exam: {
    uri: baseUrl + '/api/v1/exams/',
    methods: 'GET',
  },
  cet: {
    uri: baseUrl + '/api/v1/cets/',
    methods: 'GET',
  },
};
