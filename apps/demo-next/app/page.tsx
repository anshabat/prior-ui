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
      <div className="flex flex-col items-start gap-16">
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
          <div className="grid gap-6">
            <div className="flex gap-6">
              <Button tone="neutral">Neutral</Button>
              <Button tone="neutral" variant="secondary">
                Neutral
              </Button>
              <Button tone="neutral" variant="tertiary">
                Neutral
              </Button>
            </div>
            <div className="flex gap-6">
              <Button tone="destructive">Destructive</Button>
              <Button tone="destructive" variant="secondary">
                Destructive
              </Button>
              <Button tone="destructive" variant="tertiary">
                Destructive
              </Button>
            </div>
            <div className="flex gap-6 p-16 rounded-12 bg-fill-strong">
              <Button tone="inverse">Inverse</Button>
              <Button tone="inverse" variant="secondary">
                Inverse
              </Button>
              <Button tone="inverse" variant="tertiary">
                Inverse
              </Button>
            </div>
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
        <div className="grid gap-6">
          <div className="flex gap-6">
            <Button disabled>Brand</Button>
            <Button variant="secondary" disabled>
              Brand
            </Button>
            <Button variant="tertiary" disabled>
              Brand
            </Button>
          </div>
          <div className="flex gap-6">
            <Button tone="neutral" disabled>
              Neutral
            </Button>
            <Button tone="neutral" variant="secondary" disabled>
              Neutral
            </Button>
            <Button tone="neutral" variant="tertiary" disabled>
              Neutral
            </Button>
          </div>
          <div className="flex gap-6">
            <Button tone="destructive" disabled>
              Destructive
            </Button>
            <Button tone="destructive" variant="secondary" disabled>
              Destructive
            </Button>
            <Button tone="destructive" variant="tertiary" disabled>
              Destructive
            </Button>
          </div>
          <div className="flex gap-6 p-16 rounded-12 bg-fill-strong">
            <Button tone="inverse" disabled>
              Inverse
            </Button>
            <Button tone="inverse" variant="secondary" disabled>
              Inverse
            </Button>
            <Button tone="inverse" variant="tertiary" disabled>
              Inverse
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
