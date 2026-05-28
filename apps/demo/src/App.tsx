import { Alert, Button, Checkbox } from "@workspace/ui";
import { useThemeRef } from "./hooks/usePreferredColorScheme";
import { CaretUp, Checked } from "@workspace/icons";
import { Header } from "./components/Header";

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
        <div className="flex items-center gap-16">
          <div className="grid gap-6 justify-items-center">
            <Checkbox />
          </div>
          <div className="grid gap-6 justify-items-center">
            <Button colorScheme="primary" variant="solid" size="md">
              primary solid
            </Button>
            <Button colorScheme="primary" variant="outline" size="md">
              primary outline
            </Button>
            <Button colorScheme="subtle" variant="solid" size="lg">
              subtle solid
            </Button>
            <Button colorScheme="subtle" variant="outline" size="sm">
              subtle outline
            </Button>
            <Button colorScheme="primary" variant="ghost" size="md">
              ghost primary
            </Button>
            <Button colorScheme="subtle" variant="ghost" size="md">
              ghost subtle
            </Button>
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
            <CaretUp width="40px" height="40px" color="blue" />
            <Checked width="120px" height="120px" color="lime" color2="red" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
