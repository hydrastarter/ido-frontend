import {client as ipfsClient} from "./ipfsHelper";
import {infuraSubDomainBaseUrl} from "../../../environment";

export const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setProjectTokenImage:any,
    projectTokenImage:any
  ) => {
    if (!event.target.files) return;

    // const imageUrl = URL.createObjectURL(event.target.files[0]);
    setProjectTokenImage(() => ({
      ...projectTokenImage,
      // previewImgUrl: imageUrl,
      uploadingFile: true,
    }));
    const added = await ipfsClient.add(event.target.files[0]);
    const imageUrl = `${infuraSubDomainBaseUrl}/${added.path}`;

    setProjectTokenImage(() => ({
      previewImgUrl: imageUrl,
      ipfsImgUrl: `${infuraSubDomainBaseUrl}/${added.path}`,
      uploadingFile: false,
    }));
  };
