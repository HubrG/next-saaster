"use client";
import { DivFullScreenGradient } from "@/src/components/ui/@fairysaas/layout-elements/gradient-background";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import useBlogStore from "@/src/stores/blogStore";
import { BlogCategory, BlogPost, BlogTag, BlogTagOnPost } from "@prisma/client";
import { Rss, Save, Trash } from "lucide-react";
import Image from "next/image";

import { Link } from "@/src/lib/intl/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import slugify from "react-slugify";
import Showdown from "showdown";
import validator from "validator";
import { saveEditPost, saveTagsForPost } from "../../../../queries/blog/blog.action";

interface EditPostProps {
  post: BlogPost;
  categories: BlogCategory[] | undefined;
  tagsOnPost: BlogTagOnPost[] | undefined;
  tags: BlogTag[] | undefined;
}

type OptionType = { value: string; label: string; __isNew__?: boolean };

Showdown.extension("tasklists", function () {
  return [
    {
      type: "output",
      regex: /<li>\[ \](.*?)(<\/li>)/g,
      replace:
        '<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled> $1$2',
    },
    {
      type: "output",
      regex: /<li>\[x\](.*?)(<\/li>)/g,
      replace:
        '<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled checked> $1$2',
    },
  ];
});
const EditPost = ({ post, categories, tagsOnPost, tags }: EditPostProps) => {
  //
  const { fetchBlogPosts } = useBlogStore();
  const converter = new Showdown.Converter({
    extensions: ["tasklists"],
    tables: true,
    backslashEscapesHTMLTags: true,
  });
  const router = useRouter();
  const [delta, setDelta] = useState<string>(post?.content || "");
  const [markdown, setMarkdown] = useState<string>(
    post?.content ? converter.makeMarkdown(post.content) : ""
  );
  const [title, setTitle] = useState<string>(post?.title || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [image, setImage] = useState<string>(post?.image || "");
  const [excerpt, setExcerpt] = useState<string>(post?.excerpt || "");
  const [published, setPublished] = useState<boolean>(post?.published || false);
  const [oneTime, setOneTime] = useState<boolean>(false);
  const [canonicalSlugInitial, setCanonicalSlugInitial] = useState<string>(
    post?.canonicalSlug ? post.canonicalSlug : ""
  );
  const [initialPublished, setInitialPublished] = useState<boolean>(
    post?.published || false
  );
  const [canonicalSlug, setCanonicalSlug] = useState<string>(
    post?.canonicalSlug ? post.canonicalSlug : slugify(title) || ""
  );

  // Showdown
  useEffect(() => {
    if (post.categoryId) {
      setSelectedCategory(post.categoryId);
    }
  }, [post.categoryId]);

  const handleMouseDown = (e: any) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: any) => {
    if (textareaRef.current) {
      const rect = textareaRef.current.getBoundingClientRect();
      const height = rect.bottom - e.clientY;
      textareaRef.current.style.height = `${height}px`;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const formattedMarkdown = converter.makeHtml(delta);

  useEffect(() => {
    setDelta(markdown);
  }, [markdown]);

  type SavePost = (pub?: boolean) => void;
  const handleSavePost: SavePost = (pub) => {
    const tagIds = selectedTags.map((tag) => tag.value);
    const save = saveEditPost({
      id: post.id,
      image: image,
      title: title,
      content: formattedMarkdown,
      canonicalSlug: slugify(canonicalSlug),
      excerpt: excerpt,
      published: pub ? true : false,
      category: selectedCategory ? selectedCategory : null,
    });
    saveTagsForPost(post.id, tagIds);

    if (!save) {
      toaster({
        description: "An error occurred while saving the post",
        type: "error",
      });
    } else {
      toaster({
        description: "Post saved successfully",
        type: "success",
      });
      fetchBlogPosts();
      router.refresh();
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      handleSavePost();
    }
  };

  // Si on appuie sur cmd+s n'importe où sur la fenêtre, on sauvegarde
  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "s") {
        event.preventDefault();
        handleSavePost();
      }
    };
    window.addEventListener("keydown", handleSave);
    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, [handleSavePost]);

  const [selectedTags, setSelectedTags] = useState<
    { value: string; label: string; __isNew__?: boolean }[]
  >([]);

  useEffect(() => {
    const initialSelectedTags = tagsOnPost
      ? tagsOnPost.map((tagOnPost) => {
          const tag = tags?.find((tag) => tag.id === tagOnPost.tagId);
          return {
            id: tagOnPost.tagId,
            label: tag?.name || "",
            value: tag?.name ? tag.name : tagOnPost.tagId,
          };
        })
      : [];
    setSelectedTags(initialSelectedTags);
  }, [tags, tagsOnPost]);

  const [tagsOptions, setTagsOptions] = useState(
    tags
      ? tags.map((tag) => ({ id: tag.id, label: tag.name, value: tag.name }))
      : []
  );

  const handleChangeTags = (
    newValue: ReadonlyArray<OptionType> | null,
    actionMeta: any
  ) => {
    setSelectedTags([...(newValue || [])]);

    const newTags = (newValue || []).filter(
      (option) =>
        option.__isNew__ &&
        !tagsOptions.some((tagsOption) => tagsOption.label === option.label)
    );

    const newTagsWithId = newTags.map(
      (tag: { label: string; value: string }) => ({
        id: "",
        label: tag.label,
        value: tag.value,
      })
    );
    // Ajouter les nouveaux tags à tagsOptions
    setTagsOptions((prevOptions) => [...prevOptions, ...newTagsWithId]);
  };

  return (
    <>
      {" "}
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="flex flex-col w-9/12 mx-auto gap-y-5 -mt-10">
        <div className="flex w-full justify-between sticky top-[4.36rem] px-2 shadow-sm z-50 bg-transparent backdrop-blur-md py-2 items-center space-x-2  text-sm gap-y-5">
          <div>
            <Link
              href={"/admin#BlogPosts" as any}
              className="flex flex-row gap-x-2 items-center">
              <Rss className="icon" />
              <span>Back to the blog manager</span>
            </Link>
          </div>
            <div className="flex flex-row justify-left items-center gap-x-2">
              <Switch
                id="published"
                className="my-0 py-0"
                checked={published}
                onCheckedChange={(e) => {
                  setPublished(e);
                  handleSavePost(e);
                }}
              />
              <Label htmlFor="published" className=" text-sm mt-1.5">
                Publish
              </Label>
            </div>
          <div className="flex flex-row gap-x-10 items-center">
            <Button
              onClick={() => handleSavePost()}
              className="flex flex-row gap-x-2">
              <span>Save</span>
              <Save className="icon" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-10 gap-y-10 relative justify-center mt-10 w-full mx-auto">
          <Input
            placeholder="Article title"
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value);
              setCanonicalSlug(
                !canonicalSlugInitial
                  ? slugify(e.currentTarget.value)
                  : canonicalSlugInitial
              );
            }}
            className="input-blog-title"
          />
          {!validator.isURL(image) && (
            <Input
              placeholder="URL de l'image de couverture"
              value={image}
              onChange={(e) => {
                setImage(e.currentTarget.value);
              }}
              className="input-blog-image"
            />
          )}
          {image && validator.isURL(image) && (
            <div className="h-[35vh] w-full relative object-cover">
              {" "}
              <div
                className="absolute top-0 right-0 h-8 w-8 z-10 flex items-center justify-center rounded-bl-lg rounded-tr-lg bg-app-950  hover:bg-app-800 cursor-pointer"
                onClick={() => {
                  setImage("");
                }}>
                <Trash className="icon" />
              </div>
              <Image
                src={image}
                fill={true}
                alt={title}
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <article
            className="min-h-[20vh] p-5 rounded-lg"
            dangerouslySetInnerHTML={{ __html: formattedMarkdown }}></article>
          <div className="sticky bottom-[-10px]" onKeyDown={handleKeyDown}>
            <Button
              className="absolute top-0 w-auto right-0"
              onClick={() => handleSavePost()}>
              <Save />
            </Button>
            <Textarea
              ref={textareaRef}
              placeholder="Votre article en Markdown..."
              className="textareaBlogPostEditor"
              value={markdown.replace("<br>", "")}
              onChange={(e) => {
                setMarkdown(e.currentTarget.value);
              }}
            />
            <div
              className="textarea-resizer"
              onMouseDown={handleMouseDown}></div>
          </div>
          <div className="gap-y-5 flex flex-col">
            <div className="grid w-full  items-center gap-1.5">
              <Label htmlFor="canonicalSlug">Canonical URL</Label>
              <Input
                id="canonicalSlug"
                disabled={canonicalSlugInitial ? true : false}
                onChange={(e) => {
                  setCanonicalSlug(e.currentTarget.value);
                }}
                value={canonicalSlug ? canonicalSlug : slugify(title)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                className="shadcnInput "
                style={{ height: "10rem" }}
                onChange={(e) => {
                  setExcerpt(e.currentTarget.value);
                }}
                value={
                  !excerpt
                    ? // récupérer le premier paragraphe de formattedMarkdown
                      formattedMarkdown.split("</p>")[0].replace("<p>", "")
                    : excerpt
                }
              />
            </div>
            <div className=" w-full  items-center gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory ? selectedCategory : "no"}
                onValueChange={(e) => {
                  setSelectedCategory(e);
                }}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedCategory
                      ? categories?.find((cat) => cat.id === selectedCategory)
                          ?.name
                      : "No category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="no">No category</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label htmlFor="tags">Tags</Label>
              <CreatableSelect
                id="tags"
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() =>
                  "Aucune autre option. Vous pouvez créer un nouveau tag."
                }
                formatCreateLabel={(inputValue) =>
                  `Créer le tag "${inputValue}"`
                }
                onChange={handleChangeTags}
                isMulti
                options={tagsOptions}
                value={selectedTags}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPost;