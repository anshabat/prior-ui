import { Alert, Button, Checkbox, Field, Input } from "@workspace/ui";
import { ChevronUp } from "@workspace/icons";

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
            <ChevronUp width="40px" height="40px" />
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
        {/* Server component: no onDismiss here, an event handler can't be passed from the server */}
        <div className="grid gap-16 w-full max-w-2xl">
          <Alert tone="error" title="Error">
            Lorem ipsum dolor sit amet, con sec tetur adipiscing elit dolor sit.
          </Alert>
          <Alert tone="warning" title="Warning">
            Lorem ipsum dolor sit amet, con sec tetur adipiscing elit dolor sit.
          </Alert>
          <Alert tone="success" title="Success" orientation="vertical">
            Lorem ipsum dolor sit amet, con sec tetur adipiscing elit dolor sit.
          </Alert>
          <Alert tone="information" size="small" title="Information">
            Lorem ipsum dolor sit amet, consec tetur adipiscing elit.
          </Alert>
        </div>
        {/* Server component: Field's render prop runs during the server render, no client JS needed */}
        <form className="grid gap-16 w-256">
          <Field
            label="Email"
            description="We'll never share your email"
            required
          >
            {(control) => <Input {...control} type="email" name="email" />}
          </Field>
          <Field label="Password" error="Password is too short" required>
            {(control) => (
              <Input {...control} type="password" name="password" />
            )}
          </Field>
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
