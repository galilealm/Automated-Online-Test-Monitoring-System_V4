// copy-assets.js
import fs from "fs";

const filesToCopy = [
  {
    from: "user_doc/privacy_policy/privacy_policy.pdf",
    to: "docs/privacy_policy.pdf",
  },
  {
    from: "user_doc/user_doc.pdf",
    to: "docs/user_doc.pdf",
  }
];

filesToCopy.forEach(({ from, to }) => {
  fs.copyFileSync(from, to);
  console.log(`Copied ${from} → ${to}`);
});