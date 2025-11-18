import { Card } from "@/components/ui/card";

interface IUserMessageProps {
  content: string;
}

export const UserMessage = ({ content }: IUserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-word">
        {content}
      </Card>
    </div>
  );
};
