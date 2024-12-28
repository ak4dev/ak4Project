import { Container, Header } from '@cloudscape-design/components';

export default function BlogContainer() {
  /*
  Container which holds blog post content.
  Not currently utilized
  */
  return (
    <Container header={<Header variant="h3">Blog Entry</Header>}>
      <small>There's nothing here yet</small>
    </Container>
  );
}
