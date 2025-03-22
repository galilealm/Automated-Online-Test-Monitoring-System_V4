// copy-assets.js
const fs = require("fs");

const filesToCopy = [
  {
    from: "user_doc/privacy_policy/privacy_policy.pdf",
    to: "docs/privacy_policy.pdf",
  },
  {
    from: "user_doc/user_doc.pdf",
    to: "docs/user_doc.pdf",
  },
];

filesToCopy.forEach(({ from, to }) => {
  try {
    fs.copyFileSync(from, to);
    console.log(`Copied ${from} → ${to}`);
  } catch (error) {
    console.error(`Failed to copy ${from} → ${to}`, error);
  }
});