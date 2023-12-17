import { useEffect, useState } from "react";

type Responsive =
  | [
      number,
      ...{
        responsive: number;
        size: number;
      }[]
    ];

type Props =
  | {
      src: string;
      responsive?: boolean;
      alt: string;
      className?: string;
    } & (Width | Height | (Width & Height) | Fill);

type Width = { width: Responsive | number };
type Height = { height: Responsive | number };
type Fill = { fill: boolean };

function hasWidth<T extends Width | Height | Fill>(obj: T): obj is Width & T {
  const obj2 = obj as any;
  if (obj2.width) {
    return true;
  }
  return false;
}

function hasHeight<T extends Width | Height | Fill>(obj: T): obj is Height & T {
  const obj2 = obj as any;
  if (obj2.height) {
    return true;
  }
  return false;
}

function hasFill<T extends Width | Height | Fill>(
  obj: T
): obj is { fill: boolean } & T {
  const obj2 = obj as any;
  if (obj2.fill) {
    return true;
  }
  return false;
}

export default function Image(props: Props) {
  const [innerWidth, setInnerWidth] = useState<number>();
  const [w, h] = [
    hasWidth(props) ? props.width : 0,
    hasHeight(props) ? props.height : 0,
  ];
  const [width, setWidth] = useState<number>(typeof w === "number" ? w : w[0]);
  const [height, setHeight] = useState<number>(
    typeof h === "number" ? h : h[0]
  );
  const [fill, setFill] = useState<boolean>(
    hasFill(props) ? props.fill : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setInnerWidth(window.innerWidth);

    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setInnerWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    if (innerWidth && props.responsive && !fill) {
      if (hasWidth(props) && typeof props.width !== "number") {
        const width = (props.width.slice(1) as Responsive[1][]).reduce(
          (prev, current) => {
            if (innerWidth <= current.responsive) {
              return current.size;
            }
            return prev;
          },
          props.width[0]
        );
        setWidth(width);
      }
      if (hasHeight(props) && typeof props.height !== "number") {
        const height = (props.height.slice(1) as Responsive[1][]).reduce(
          (prev, current) => {
            if (innerWidth <= current.responsive) {
              return current.size;
            }
            return prev;
          },
          props.height[0]
        );
        setHeight(height);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerWidth, props.responsive]);

  return (
    <img
      src={props.src}
      alt={props.alt}
      {...(width > 0 && height > 0 && !fill ? { width, height } : {})}
      {...(width > 0 && !fill
        ? {
            width,
          }
        : {})}
      {...(height > 0 && !fill
        ? {
            height,
          }
        : {})}
      {...(fill
        ? {
            width: "100%",
            height: "100%",
            style: {
              objectFit: "cover",
              overflow: "hidden",
            },
          }
        : {})}
      loading="lazy"
      className={props.className}
    />
  );
}
