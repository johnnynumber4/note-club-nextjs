import clsx from 'clsx';
import styles from './ListenLinks.module.css';
import { Typography } from '@material-ui/core';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Description } from '@/components/Description';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  accordion: {
    width: '100%',
    margin: 'auto',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: 'unset',
    backgroundColor: 'unset',
    boxShadow: 'var(--shadow-smallest)',
    borderRadius: '8px',
    transition: 'ease 0.2s box-shadow',
  },
}));

const ListenLinks = ({ post, className }) => {
  // const [expanded, setExpanded] = React.useState(false);

  // const handleChange = (panel) => (event, isExpanded) => {
  //   console.log(panel);
  //   console.log(isExpanded);
  //   setExpanded(isExpanded ? panel : false);
  // };

  const classes = useStyles();

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.wrap}>
        <div>
          <div style={{ textAlign: 'center' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/videoseries?list=${post.yt}`}
              title="YT album"
              frameBorder="0"
              allow="autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <Accordion
              key={1}
              // expanded={expanded === 'description'}
              expanded="true"
              aria-controls="panel1a-content"
              id="panel1a-header"
              // onChange={handleChange('description')}
              className={classes.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography> About the Album </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Description post={post} />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenLinks;
