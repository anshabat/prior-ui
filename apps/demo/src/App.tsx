import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Field,
  Heading,
  Input,
  Link,
  Logo,
  Stack,
  Text,
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
        <Logo />
        <Heading as="h1">Hello world!</Heading>
        <Text tone="weak">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          voluptas soluta itaque, velit vel magni iusto, cumque vitae hic
          quaerat tenetur omnis tempore voluptatem mollitia suscipit. Architecto
          nihil dolorum maiores.
        </Text>
        <div className="flex flex-col items-start gap-16">
          <div className="grid gap-16">
            <Heading as="h2" size="display">
              Display
            </Heading>
            <Heading as="h2" size="heading-1">
              Heading 1
            </Heading>
            <Heading as="h2">Heading 2 (h2 default)</Heading>
            <Heading as="h3">Heading 3 (h3 default)</Heading>
            <Heading as="h4">Heading 4 (h4 default)</Heading>
            <Heading as="h3" size="heading-4">
              h3 that looks like Heading 4
            </Heading>
          </div>
          <div className="grid gap-16 max-w-2xl">
            <Text size="large" tone="weak">
              Large: a lead paragraph under a page title.
            </Text>
            <Text>Small (default): body text, weak weight, strong tone.</Text>
            <Text weight="strong">Small strong</Text>
            <Text tone="weak">Small weak tone: secondary text</Text>
            <Text size="tiny">Tiny</Text>
            <Text size="tiny" weight="strong" tone="weak">
              Tiny strong, weak tone
            </Text>
            <Text>
              A paragraph with an inline{" "}
              <Text as="span" weight="strong">
                strong span
              </Text>{" "}
              inside it.
            </Text>
          </div>
          <Stack gap="24">
            <Stack as="hgroup" gap="8">
              <Heading as="h2" size="heading-4">
                Stack as hgroup: column, gap 8
              </Heading>
              <Text tone="weak">Title and subtitle, like the auth pages</Text>
            </Stack>
            <Stack direction="row" gap="8" align="center">
              <Button size="small">Row</Button>
              <Button size="medium">gap 8</Button>
              <Button>align center</Button>
            </Stack>
            <Stack direction="row" gap="16" align="baseline">
              <Text size="large">Baseline</Text>
              <Text size="tiny">aligned text</Text>
            </Stack>
            <Stack as="ul" direction="row" gap="16">
              <li>
                <Text as="span">Stack as ul: first</Text>
              </li>
              <li>
                <Text as="span">second</Text>
              </li>
            </Stack>
            <Stack direction="row" justify="between">
              <Text>justify between</Text>
              <Text>end</Text>
            </Stack>
          </Stack>
          <Stack gap="16">
            <Stack direction="row" gap="24" align="center">
              <Link href="#link">Brand</Link>
              <Link href="#link" tone="neutral-strong">
                Neutral strong
              </Link>
              <Link href="#link" tone="neutral-weak">
                Neutral weak
              </Link>
              <Link href="#link" tone="destructive">
                Destructive
              </Link>
            </Stack>
            <div className="p-16 rounded-12 bg-fill-strong">
              <Stack direction="row" gap="24">
                <Link href="#link" tone="inverse-strong">
                  Inverse strong
                </Link>
                <Link href="#link" tone="inverse-weak">
                  Inverse weak
                </Link>
              </Stack>
            </div>
            <Stack direction="row" gap="24" align="baseline">
              <Link href="#link" size="large">
                Large
              </Link>
              <Link href="#link" weight="strong">
                Small strong
              </Link>
              <Link href="#link" size="tiny">
                Tiny
              </Link>
              <Link href="#link" size="tiny" weight="strong">
                Tiny strong
              </Link>
              <Link href="#link" underline={false}>
                No underline
              </Link>
              <Link asChild tone="neutral-strong">
                <a href="#link">asChild</a>
              </Link>
            </Stack>
            <Text size="tiny" tone="weak">
              Already have an account?{" "}
              <Link href="#link" size="tiny">
                Log in
              </Link>
            </Text>
          </Stack>
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
            <Divider />
            <Divider tone="strong" />
            <Divider>OR</Divider>
            <Divider tone="strong">Labeled strong</Divider>
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
