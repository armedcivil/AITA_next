import { EditorAsset } from '.';
import EditorAssetCell from './cell';
export default function List({
  editorAssets,
  onSelect,
}: {
  editorAssets: EditorAsset[];
  onSelect: (asset: EditorAsset) => void;
}) {
  return (
    <div className="align-center flex flex-row">
      {editorAssets.map((asset, index) => {
        return (
          <EditorAssetCell
            key={index}
            editorAsset={asset}
            onClick={(e) => {
              onSelect(asset);
            }}
          />
        );
      })}
    </div>
  );
}
