import NextTopLoader from "nextjs-toploader";

export const TopLoader = () => {
  return (
    <NextTopLoader
      template='<div class="bar" role="bar"><div class="peg"></div></div> 
              <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      initialPosition={0.08}
      crawlSpeed={200}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow={false}
    />
  );
};
