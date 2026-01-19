import type { Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Plugin remark pour la typographie francaise.
 * Ajoute automatiquement des espaces insecables avant : ; ! ?
 * et apres les guillemets ouvrants, avant les guillemets fermants.
 */
const remarkFrenchTypography: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "text", (node: Text) => {
      let text = node.value;

      // Espace insecable avant : ; ! ?
      text = text.replace(/ ([:;!?])/g, "\u00A0$1");

      // Guillemets francais : espace insecable apres « et avant »
      text = text.replace(/« /g, "«\u00A0");
      text = text.replace(/ »/g, "\u00A0»");

      node.value = text;
    });
  };
};

export default remarkFrenchTypography;
