import type { GetImageResult, ImageMetadata } from "astro";
import { Image, getImage } from "astro:assets";
import { useEffect, useState } from "react";

type Props = {
  src: ImageMetadata;
  alt: string;
  width?: number;
  height?: number;
};

export default function AssetImage(props: Props) {
  const [image, setImage] = useState<GetImageResult | null>(null);

  useEffect(() => {
    getImage({
      src: props.src,
      width: props.width,
      height: props.height,
    }).then((res) => setImage(res));
  }, []);

  return (
    <>
      {image && (
        <img
          src={image.src}
          style={{
            width: "100%",
            height: "100%",
          }}
          width={props.width ?? image.options.width}
          height={props.height ?? image.options.height}
          alt={props.alt}
        />
      )}
    </>
  );
  //   return <Image src={props.src} alt={props.alt} />;
}
