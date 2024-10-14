"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import starterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useToast } from "@/components/ui/use-toast";
import { useSubmitPostMutation } from "./mutations";

type Props = {};

function PostEditor({}: Props) {
  const { user } = useSession();
  const { toast } = useToast();
  const editor = useEditor({
    extensions: [
      starterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const mutation = useSubmitPostMutation();

  const onSubmit = async () => {
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
        // toast({
        //   title: "Post created",
        // });
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.avatarUrl ?? ""}
            className="hidden sm:inline"
          />
        </Avatar>
        <EditorContent
          editor={editor}
          className="max-h-[28rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
          isLoading={mutation.isPending}
        >
          Post
        </Button>
      </div>
    </div>
  );
}

export default PostEditor;
