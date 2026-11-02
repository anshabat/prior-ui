import {
  Alert,
  Button,
  Checkbox,
  Field,
  Input,
  type AlertProps,
} from "@workspace/ui";
import { useThemeRef } from "./hooks/usePreferredColorScheme";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "@workspace/icons";
import { Header } from "./components/Header";

type Tone = AlertProps["tone"];

const tones: Tone[] = ["error", "warning", "success", "information"];

// The dismiss button renders only when there is a handler; the demo just shows it
const noop = () => {};

function App() {
  const themeRef = useThemeRef();

  return (
    <div
      ref={themeRef}
      className="mw-full h-screen flex flex-col gap-4 bg-neutral"
    >
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-bold text-default">Hello world!</h1>
        <p className="text-muted">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          voluptas soluta itaque, velit vel magni iusto, cumque vitae hic
          quaerat tenetur omnis tempore voluptatem mollitia suscipit. Architecto
          nihil dolorum maiores.
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
              <ChevronUp width="40px" height="40px" color="blue" />
              <CheckCircle width="120px" height="120px" color="lime" />
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
          <div className="grid gap-16 w-full max-w-2xl">
            {tones.map((tone) => (
              <Alert
                key={tone}
                tone={tone}
                title={`${tone} alert`}
                onDismiss={noop}
              >
                Lorem ipsum dolor sit amet, con sec tetur adipiscing elit dolor
                sit. Lorem ipsum dolor sit amet elit.
              </Alert>
            ))}
            <Alert tone="error" orientation="vertical" title="Vertical">
              Lorem ipsum dolor sit amet, con sec tetur adipiscing elit dolor
              sit. Lorem ipsum dolor sit amet elit.
            </Alert>
            <Alert tone="warning">Large, without a title</Alert>
            <Alert tone="success" size="small" title="Small" onDismiss={noop}>
              Lorem ipsum dolor sit amet, consec tetur adipiscing elit.
            </Alert>
            <Alert
              tone="information"
              size="small"
              orientation="vertical"
              title="Small vertical"
              onDismiss={noop}
            >
              Lorem ipsum dolor sit amet, consec tetur adipiscing elit.
            </Alert>
            <Alert tone="error" size="small" role="alert">
              Small, without a title, announced as a live region
            </Alert>
          </div>
          <div className="grid gap-16 w-256">
            <Field label="Name">
              {(control) => <Input {...control} placeholder="Jane Doe" />}
            </Field>
            <Field label="Small">
              {(control) => <Input {...control} size="small" />}
            </Field>
            <Field
              label="Email"
              description="We'll never share your email"
              required
            >
              {(control) => <Input {...control} type="email" />}
            </Field>
            <Field
              label="Password"
              description="At least 8 characters"
              error="Password is too short"
              required
            >
              {(control) => <Input {...control} type="password" />}
            </Field>
            <Field label="Company" description="Set by your admin" disabled>
              {(control) => <Input {...control} defaultValue="Acme" />}
            </Field>
            <Input
              aria-label="Search"
              name="search"
              type="search"
              placeholder="Search"
              startIcon={<Search />}
            />
            <Input
              aria-label="Search small"
              name="search-small"
              type="search"
              placeholder="Search"
              startIcon={<Search />}
              size="small"
            />
            <Input
              aria-label="Search disabled"
              name="search-disabled"
              type="search"
              placeholder="Search"
              startIcon={<Search />}
              disabled
            />
            <Input
              aria-label="Decorative end icon"
              name="decorative-end-icon"
              placeholder="Decorative end icon"
              endIcon={<ChevronDown />}
            />
            <Input
              aria-label="Both icons"
              name="both-icons"
              placeholder="Both icons"
              startIcon={<Search />}
              endIcon={<X />}
              size="small"
            />
            <Input
              aria-label="Icon button"
              name="icon-button"
              placeholder="Icon button at the end"
              startIcon={<Search />}
              endIcon={
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => alert("Clear clicked")}
                >
                  <X />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
