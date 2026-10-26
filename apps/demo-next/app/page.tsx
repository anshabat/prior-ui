import { Alert, Button, Checkbox } from "@workspace/ui";
import { CaretUp } from "@workspace/icons";

export default function Page() {
  return (
    <div className="mw-full h-screen flex flex-col items-center justify-center gap-4 bg-neutral p-4">
      <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
      <p className="text-muted">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi voluptas
        soluta itaque, velit vel magni iusto, cumque vitae hic quaerat tenetur
        omnis tempore voluptatem mollitia suscipit. Architecto nihil dolorum
        maiores.
      </p>
      <div className="flex items-center gap-16">
        <div className="grid gap-6 justify-items-center">
          <Checkbox />
        </div>
        <div className="grid gap-6 justify-items-center">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div className="grid gap-6 justify-items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
        </div>
        <div className="grid gap-6 justify-items-center">
          <Alert title="Solid success" colorScheme="success">
            This is a description
          </Alert>
          <Alert title="Solid error" colorScheme="error">
            This is a description
          </Alert>
          <Alert title="Solid warning" colorScheme="warning">
            This is a description
          </Alert>
          <Alert title="Solid info" colorScheme="info">
            This is a description
          </Alert>
        </div>
        <div className="grid gap-6 justify-items-center">
          <Alert
            title="Outline success"
            colorScheme="success"
            variant="outline"
          >
            This is a description
          </Alert>
          <Alert title="Outline error" colorScheme="error" variant="outline">
            This is a description
          </Alert>
          <Alert
            title="Outline warning"
            colorScheme="warning"
            variant="outline"
          >
            This is a description
          </Alert>
          <Alert title="Outline info" colorScheme="info" variant="outline">
            This is a description
          </Alert>
        </div>
        <div className="grid gap-6 justify-items-center">
          <CaretUp width="40px" height="40px" />
        </div>
      </div>
    </div>
  );
}
