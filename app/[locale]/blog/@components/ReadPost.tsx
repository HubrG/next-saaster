import { Bookmark, Tag } from "lucide-react";
import Image from "next/image";

import { Link } from "@/src/lib/intl/navigation";
import { iBlog } from "@/src/types/db/iBlog";
import React, { Suspense } from "react";
import { v4 } from "uuid";
import { BlogBreadCrumb } from "./Breadcrumb";


interface BlogPostProps {
  blogPost: iBlog;
}

export const ReadPost: React.FC<BlogPostProps> = ({ blogPost }) => {
  return (
    <>
      {blogPost.content && blogPost.title ? (
        <>
          <Suspense fallback={<p className="text-center">...</p>}>
            <BlogBreadCrumb post={blogPost} />
          </Suspense>
          <article>
            <h1 className="text-left my-5">{blogPost.title}</h1>
            {blogPost.image && (
              <div className="h-[35vh] w-full relative object-cover">
                <Image
                  src={blogPost.image}
                  alt={blogPost.title ?? "Aucun"}
                  fill
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 576px"
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div
              className="mt-14"
              dangerouslySetInnerHTML={{
                __html: blogPost.content + "lorem ispu",
              }}
            />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            vel urna id erat aliquam rutrum porta id erat. Aenean diam turpis,
            sagittis nec elit id, sagittis hendrerit eros. Proin sit amet augue
            sit amet nunc auctor suscipit eu quis tellus. Proin quis eros ipsum.
            Phasellus vulputate tellus a dapibus fringilla. Integer pellentesque
            ligula massa, ac congue ligula semper sed. Fusce a est in sem
            condimentum feugiat a vel mauris. Aliquam euismod lobortis ante. Sed
            ac varius sapien. Sed tempor, mauris quis condimentum sollicitudin,
            turpis sem gravida mi, id consequat quam risus mollis lorem. Ut
            elementum placerat condimentum. Sed maximus dolor nec semper dictum.
            Fusce ornare nisl dolor, id ornare neque posuere at. Vestibulum
            aliquam blandit sollicitudin. Morbi cursus vel leo sit amet porta.
            Mauris interdum sapien vel nibh tincidunt finibus. Nullam in erat
            varius, tempor nisi in, eleifend erat. Nullam commodo sem ac magna
            fringilla, sed viverra ipsum volutpat. Quisque quis lectus ut orci
            feugiat congue eget eu urna. Phasellus interdum enim a efficitur
            sollicitudin. Nam mattis laoreet metus quis hendrerit. Vestibulum
            nisi ipsum, blandit sit amet tellus non, lacinia iaculis sapien. In
            non vulputate magna, eget congue lectus. Aliquam consequat est a
            purus pretium, cursus efficitur orci imperdiet. Nullam vitae purus
            non dui placerat aliquet id vel diam. Aenean vitae aliquam metus.
            Donec eget leo consequat turpis vulputate rutrum. Morbi ut semper
            ipsum, eget posuere massa. In congue maximus urna vitae dapibus.
            Praesent egestas dui at felis congue commodo. Maecenas nec tincidunt
            mauris. Suspendisse urna nulla, aliquet in nulla non, varius auctor
            tortor. Suspendisse a diam nisi. Etiam turpis tortor, efficitur sed
            quam eget, ultricies sollicitudin erat. Nam semper, felis ut
            ullamcorper luctus, nisi risus gravida turpis, interdum placerat
            lorem neque a neque. Ut ornare ligula ac interdum posuere. Quisque
            porta ultrices mi, quis placerat urna pharetra fringilla. Nam
            consectetur porta mattis. Nam vehicula nisi ut tincidunt
            scelerisque. Pellentesque at justo efficitur, tincidunt turpis a,
            fringilla nibh. Praesent convallis finibus augue et volutpat.
            Quisque ac diam aliquam, dignissim dolor eget, tempus leo. Vivamus
            facilisis vel nisl nec molestie. Nulla tincidunt odio ac vulputate
            feugiat. Pellentesque gravida nibh ante, sit amet pellentesque enim
            consectetur ac. Aenean vehicula id eros eget euismod. Sed enim mi,
            gravida vitae laoreet id, accumsan non magna. In feugiat molestie
            leo id luctus. Morbi non velit commodo, commodo purus ac, dapibus
            mi. Sed ultrices finibus orci, quis condimentum nulla dictum non.
            Vestibulum eleifend pellentesque ipsum. Nam augue neque, feugiat at
            tellus id, facilisis malesuada enim. Vestibulum faucibus luctus
            turpis. Donec hendrerit auctor diam, eu luctus dui interdum et. Cras
            porttitor eros sed efficitur eleifend. Nulla quis risus dui. In
            gravida rhoncus urna ac consectetur. Nunc pretium a justo sed
            blandit. Aliquam erat volutpat. Aenean interdum sem sit amet
            vulputate tincidunt. Fusce eu diam sed dui viverra hendrerit nec
            eget quam. Quisque faucibus, urna pretium viverra dignissim, ex ante
            gravida nulla, nec rhoncus lacus nisi vel erat. Aliquam et quam vel
            sapien vehicula luctus at vitae tortor. Quisque ut finibus tellus.
            Phasellus non felis consequat, auctor est feugiat, facilisis turpis.
            Maecenas eu pulvinar elit, vel finibus nisi. Nullam nec lobortis
            nibh, at porta quam. Duis auctor, velit ut luctus laoreet, ex nisl
            rutrum risus, facilisis facilisis tellus urna feugiat mauris. Nam
            consectetur enim ultrices pulvinar congue. Praesent eu malesuada
            dui. Donec lobortis nisl quis elit vulputate, in gravida dolor
            auctor. Suspendisse sapien mi, aliquam eu elementum sit amet,
            hendrerit quis odio. Praesent eu fermentum eros, vitae tempor orci.
            Ut ut vestibulum odio. Vivamus quam mauris, lacinia non rutrum eget,
            vehicula id justo. Morbi condimentum metus nec euismod elementum.
            Aliquam eget rutrum ex, eget lacinia odio. Nunc eu egestas sapien,
            vitae dignissim turpis. Vivamus aliquam posuere justo, non venenatis
            tellus hendrerit vel. Praesent eget ligula velit. Vestibulum posuere
            commodo enim, nec porttitor tortor cursus non. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Sed arcu orci, tempus eu diam quis, varius imperdiet
            urna. Aenean tristique elit nec fringilla fringilla. Cras egestas
            augue ultrices mi eleifend rutrum. Sed consequat malesuada
            efficitur. Praesent id dui non arcu tincidunt consectetur. Nunc
            venenatis, est ut consectetur tempor, mi quam porttitor libero, et
            semper lectus nisl non massa. Mauris porttitor quis dui ac
            tincidunt. Integer sollicitudin commodo turpis eget finibus. Fusce
            malesuada urna lorem, quis blandit massa tempus a. Nullam sed
            pretium tortor. Integer at fringilla ligula. Fusce ac ipsum molestie
            erat accumsan porttitor. Aliquam id tortor vulputate, sodales erat
            sit amet, viverra turpis. Fusce imperdiet, purus ut convallis
            facilisis, nibh enim malesuada metus, nec eleifend leo justo ut
            urna. Donec condimentum nulla in tortor elementum lacinia. Fusce sed
            dui orci. Vivamus lorem nulla, aliquet vitae ligula sit amet,
            sollicitudin ultrices sapien. Aenean sed lobortis arcu. Pellentesque
            consectetur purus eget magna placerat euismod. Maecenas non finibus
            dolor, eu porta sem. Suspendisse lobortis quam eu ex laoreet,
            vestibulum fermentum lectus pretium. Sed vel nunc nec velit
            pellentesque facilisis non vel nulla. Sed quam leo, dapibus in urna
            vel, varius viverra orci. Etiam mi est, dignissim non dictum in,
            fringilla vitae urna. Quisque in dolor in tellus tristique tincidunt
            euismod sit amet massa.
            <div className="flex flex-col gap-5  my-10">
              {blogPost.category && (
                <div className="inline-flex gap-3 items-center flex-wrap ">
                  <Bookmark className="icon" />
                  <Link
                    href={`/blog/category/${blogPost.category.slug}` as any}>
                    {blogPost.category.name}
                  </Link>
                </div>
              )}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="inline-flex gap-3 items-center flex-wrap ">
                  <Tag className="icon" />
                  {blogPost.tags.map((tag) => (
                    <React.Fragment key={v4() + tag.tag.id}>
                      <Link href={`/blog/tag/${tag.tag.slug}` as any}>
                        {tag.tag.name}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </article>
        </>
      ) : (
        <div className="text-center">
          <h1>Aucun article</h1>
        </div>
      )}
    </>
  );
};
