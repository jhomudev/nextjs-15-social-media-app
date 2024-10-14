import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";

export default function Home() {
  return (
    <main className="flex h-[200vh] w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <br />
        <Tabs
          defaultValue="for-you"
          className="flex w-full flex-col items-center"
        >
          <TabsList className="flex w-full max-w-2xl items-center">
            <TabsTrigger className="flex-1" value="for-you">
              For You
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="following">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you" className="w-full">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following" className="w-full">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
