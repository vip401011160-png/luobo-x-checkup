/* 已知标签的中文解释。来源：X 开源代码 xai-org/x-algorithm 的 under-the-hood 示例数据（SPAM_HIGH_RECALL、NSFW_TEXT、SpamHighRecall），
   以及媒体公开报道的测试案例（NSFW_HIGH_PRECISION、NSFW_HIGH_RECALL，见 IT之家 2026-08-14）。未收录的标签按关键词给出大致解释。 */
window.LUOBO_LABELS = {
  SPAM_HIGH_RECALL: {zh:"被自动系统判断为「可能是垃圾信息」的帖子（宽口径判定，误伤也算在内）", fix:"少用无关热门标签、别重复发相似文案、别在帖子里堆链接和 @。"},
  SpamHighRecall: {zh:"账号被自动系统判断为「可能在发垃圾信息」", fix:"停掉互关/互赞、批量关注取关、复制粘贴式评论；连续几周正常发原创后通常会消失。"},
  NSFW_TEXT: {zh:"帖子文字被判断为可能含成人/性暗示语言", fix:"去掉擦边词和成人暗示标签（例如 #唾液 这类），这类标签会让帖子不推给陌生人和未成年人。"},
  NSFW_HIGH_PRECISION: {zh:"被高置信度判断为成人/敏感内容", fix:"这类帖子基本不会推荐给陌生人；想涨粉就把擦边内容和日常内容分开。"},
  NSFW_HIGH_RECALL: {zh:"被宽口径判断为「可能」是成人/敏感内容（误伤也算）", fix:"检查图片和文案有没有容易误判的元素：大面积肌肤、暗示性标签等。"}
};
window.LUOBO_KEYWORDS = [
  [/nsfw|adult|sensitive|graphic|gore|violen/i, "敏感/成人/暴力类内容", "这类标签通常会让帖子不推荐给陌生人。把敏感内容和日常内容分开发。"],
  [/spam|bot|automat|duplicate/i, "垃圾信息/自动化类", "减少重复文案、无关标签、批量互动，节奏放慢像真人。"],
  [/toxic|abus|harass|insult|hate/i, "攻击/骚扰类", "避开吵架帖、别用攻击性词语，被举报扣分极重。"],
  [/low.?quality|lowq|quality/i, "低质量内容", "多发原创、有信息量或有真实感受的内容。"],
  [/misinfo|misleading|community.?note|note/i, "误导信息/社区注释相关", "核实信息来源，被加注释的帖子推荐会受影响。"],
  [/withheld|country|legal|government/i, "因当地法律/政府要求被限制", "这只影响特定国家/地区的可见性。"]
];
window.LUOBO_EFFECT = [
  [/hidden from recommendations to non-followers/i, "不会推荐给没关注你的人（老粉仍能看到）"],
  [/hidden from underage users/i, "对未成年用户隐藏"],
  [/users without a stated age/i, "对没填年龄的用户隐藏"],
  [/logged out users/i, "对未登录访客隐藏"],
  [/search/i, "可能影响在搜索中的展示"],
  [/withheld/i, "在部分国家/地区不可见"]
];
/* X 开源代码 under-the-hood/jetfuel/routes/_lib/mock.ts 中的官方示例（MOCK_LABELED），仅用于演示 */
window.LUOBO_SAMPLE = {"period":{"startDate":"2026-08-01","endDate":"2026-08-31","timezone":"UTC"},"generatedAt":"2026-09-09T23:59:59Z","postCount":40,"postLabels":[{"label":"SPAM_HIGH_RECALL","about":"Post detected by automated systems as one that may contain spam.","effect":"Post hidden from recommendations to non-followers.","posts":3,"totalPostsInMonth":40,"percentageOfPosts":"7.50%"},{"label":"NSFW_TEXT","about":"Post detected by automated systems as likely to contain adult sexually explicit language.","effect":"Post hidden from recommendations to non-followers, and hidden from underage users, users without a stated age, and logged out users.","posts":1,"totalPostsInMonth":40,"percentageOfPosts":"2.50%"}],"accountLabels":[{"label":"SpamHighRecall","about":"Account detected by automated systems as likely to post spam.","effect":"The account's posts are hidden from recommendations to non-followers.","days":5,"daysInPeriod":31,"percentageOfDays":"16.12%"}]};
